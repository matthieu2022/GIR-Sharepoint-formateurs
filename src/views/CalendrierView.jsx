import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getEvents, createEvent, deleteEvent, getUsers, getSalles } from '../services/storage'
import EventModal from '../components/EventModal'

export default function CalendrierView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [users, setUsers] = useState([])
  const [salles, setSalles] = useState([])

  useEffect(() => {
    loadEvents()
    setUsers(getUsers())
    setSalles(getSalles())
  }, [])

  const loadEvents = () => {
    setEvents(getEvents())
  }

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setShowModal(true)
  }

  const handleSaveEvent = (eventData) => {
    createEvent(eventData)
    loadEvents()
    setShowModal(false)
    setSelectedDate(null)
  }

  const handleDeleteEvent = (eventId) => {
    if (confirm('Supprimer cet événement ?')) {
      deleteEvent(eventId)
      loadEvents()
    }
  }

  // Générer les jours du calendrier
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: fr })
  const calendarEnd = endOfWeek(monthEnd, { locale: fr })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Grouper par semaines
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  const getEventsForDay = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return isSameDay(eventDate, date)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <p className="text-gray-600 mt-1">
              {events.length} événement{events.length > 1 ? 's' : ''} ce mois-ci
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToday}
              className="btn-secondary text-sm"
            >
              Aujourd'hui
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedDate(new Date())
                setShowModal(true)
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvel événement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendrier */}
      <div className="card">
        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <span className="text-sm font-semibold text-gray-700">{day}</span>
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="bg-gray-200 rounded-b-lg overflow-hidden">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-px">
              {week.map(day => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`bg-white p-2 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${
                      !isCurrentMonth ? 'opacity-40' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday
                        ? 'w-7 h-7 flex items-center justify-center bg-primary-500 text-white rounded-full'
                        : 'text-gray-900'
                    }`}>
                      {format(day, 'd')}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${
                            event.type === 'cours'
                              ? 'bg-primary-100 text-primary-800'
                              : event.type === 'examen'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEvent(event.id)
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary-100 rounded"></div>
            <span className="text-sm text-gray-700">Cours</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-sm text-gray-700">Examen</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-sm text-gray-700">Événement</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <EventModal
          date={selectedDate}
          users={users}
          salles={salles}
          onClose={() => {
            setShowModal(false)
            setSelectedDate(null)
          }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  )
}
