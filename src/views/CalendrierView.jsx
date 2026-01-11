import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getEvents, createEvent, deleteEvent, getUsers, getSalles, getGroupesGIR } from '../services/storage'
import EventModal from '../components/EventModal'

export default function CalendrierView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [users, setUsers] = useState([])
  const [salles, setSalles] = useState([])
  const [groupesGIR, setGroupesGIR] = useState([])

  useEffect(() => {
    loadEvents()
    setUsers(getUsers())
    setSalles(getSalles())
    setGroupesGIR(getGroupesGIR())
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

  const handleGroupeClick = (groupeId, e) => {
    e.stopPropagation()
    // Naviguer vers l'onglet Listing groupe GIR et scroller vers le groupe
    const event = new CustomEvent('navigateToGroupe', { detail: groupeId })
    window.dispatchEvent(event)
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

  // Obtenir les groupes GIR actifs pour un jour donné
  const getActiveGroupesForDay = (date) => {
    return groupesGIR.filter(groupe => {
      if (!groupe.dateEntree || groupe.statut !== 'Actif') return false
      
      const dateEntree = new Date(groupe.dateEntree)
      const dateSortie = groupe.dateSortie ? new Date(groupe.dateSortie) : new Date(2099, 11, 31)
      
      try {
        return isWithinInterval(date, { start: dateEntree, end: dateSortie })
      } catch (e) {
        return false
      }
    })
  }

  // Couleurs pour les groupes GIR
  const groupeColors = [
    { bg: 'bg-blue-50', border: 'border-l-4 border-blue-400', text: 'text-blue-700' },
    { bg: 'bg-green-50', border: 'border-l-4 border-green-400', text: 'text-green-700' },
    { bg: 'bg-purple-50', border: 'border-l-4 border-purple-400', text: 'text-purple-700' },
    { bg: 'bg-orange-50', border: 'border-l-4 border-orange-400', text: 'text-orange-700' },
    { bg: 'bg-pink-50', border: 'border-l-4 border-pink-400', text: 'text-pink-700' },
    { bg: 'bg-indigo-50', border: 'border-l-4 border-indigo-400', text: 'text-indigo-700' },
  ]

  const getGroupeColor = (groupeId) => {
    const index = groupesGIR.findIndex(g => g.id === groupeId)
    return groupeColors[index % groupeColors.length]
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
                const activeGroupes = getActiveGroupesForDay(day)
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
                      {/* Afficher les groupes GIR actifs */}
                      {activeGroupes.map(groupe => {
                        const color = getGroupeColor(groupe.id)
                        return (
                          <div
                            key={`groupe-${groupe.id}`}
                            className={`text-xs px-2 py-0.5 rounded ${color.bg} ${color.border} ${color.text} truncate cursor-pointer hover:opacity-80 transition-opacity`}
                            title={`${groupe.nom} (${groupe.dateEntree} → ${groupe.dateSortie || '∞'}) - Cliquez pour voir la fiche`}
                            onClick={(e) => handleGroupeClick(groupe.id, e)}
                          >
                            📚 {groupe.nom}
                          </div>
                        )
                      })}

                      {/* Afficher les événements */}
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

      {/* Légende des groupes GIR */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Légende des groupes GIR</h3>
        {groupesGIR.filter(g => g.statut === 'Actif').length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {groupesGIR
              .filter(g => g.statut === 'Actif')
              .map((groupe) => {
                const color = getGroupeColor(groupe.id)
                return (
                  <div key={groupe.id} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${color.bg} ${color.border}`}></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">{groupe.nom}</span>
                      {(groupe.dateEntree || groupe.dateSortie) && (
                        <span className="text-xs text-gray-500">
                          {groupe.dateEntree && format(new Date(groupe.dateEntree), 'dd/MM/yy')}
                          {groupe.dateEntree && groupe.dateSortie && ' → '}
                          {groupe.dateSortie && format(new Date(groupe.dateSortie), 'dd/MM/yy')}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aucun groupe GIR actif</p>
        )}
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
