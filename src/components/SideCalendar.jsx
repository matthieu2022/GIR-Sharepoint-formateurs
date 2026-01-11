import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUsers, getEvents } from '../services/storage'

export default function SideCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    setUsers(getUsers())
    setEvents(getEvents())
  }, [])

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: fr })
  const calendarEnd = endOfWeek(monthEnd, { locale: fr })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

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

  // Grouper les utilisateurs actifs par groupe
  const groupes = {}
  users
    .filter(u => u.etat === 'Actif')
    .forEach(user => {
      if (user.groupe) {
        if (!groupes[user.groupe]) {
          groupes[user.groupe] = []
        }
        groupes[user.groupe].push(user)
      }
    })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-sm">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePreviousMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini calendrier */}
      <div className="space-y-1">
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map(day => {
              const dayEvents = getEventsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const hasEvents = dayEvents.length > 0

              return (
                <div
                  key={day.toISOString()}
                  className={`text-center text-xs py-1 rounded ${
                    isToday
                      ? 'bg-primary-500 text-white font-bold'
                      : isCurrentMonth
                      ? hasEvents
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400'
                  } transition-colors cursor-pointer`}
                  title={hasEvents ? `${dayEvents.length} événement(s)` : ''}
                >
                  {format(day, 'd')}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Liste des groupes */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">
          Groupes actifs ({Object.keys(groupes).length})
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(groupes).map(([groupe, membres]) => (
            <div
              key={groupe}
              className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{groupe}</span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                  {membres.length}
                </span>
              </div>
            </div>
          ))}
          {Object.keys(groupes).length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              Aucun groupe actif
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
