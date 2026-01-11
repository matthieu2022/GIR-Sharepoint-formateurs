import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'
import { getUsers, getEvents, getGroupesGIR } from '../services/storage'

export default function SideCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [groupesGIR, setGroupesGIR] = useState([])

  useEffect(() => {
    setUsers(getUsers())
    setEvents(getEvents())
    setGroupesGIR(getGroupesGIR())
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

  // Couleurs pour les groupes GIR (palette harmonieuse)
  const groupeColors = [
    'bg-blue-200',
    'bg-green-200', 
    'bg-purple-200',
    'bg-orange-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-yellow-200',
    'bg-teal-200'
  ]

  const getGroupeColor = (groupeId) => {
    const index = groupesGIR.findIndex(g => g.id === groupeId)
    return groupeColors[index % groupeColors.length]
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
              const activeGroupes = getActiveGroupesForDay(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isToday = isSameDay(day, new Date())
              const hasEvents = dayEvents.length > 0
              const hasGroupes = activeGroupes.length > 0

              // Si plusieurs groupes actifs, afficher une couleur composite
              let bgColor = 'bg-white'
              if (hasGroupes && activeGroupes.length === 1) {
                bgColor = getGroupeColor(activeGroupes[0].id)
              } else if (hasGroupes && activeGroupes.length > 1) {
                bgColor = 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
              }

              return (
                <div
                  key={day.toISOString()}
                  className={`text-center text-xs py-1 rounded relative ${
                    isToday
                      ? 'bg-primary-500 text-white font-bold ring-2 ring-primary-300'
                      : isCurrentMonth
                      ? hasGroupes
                        ? `${bgColor} text-gray-900 font-medium`
                        : hasEvents
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400'
                  } transition-colors cursor-pointer`}
                  title={
                    hasGroupes 
                      ? `${activeGroupes.length} groupe(s) actif(s): ${activeGroupes.map(g => g.nom).join(', ')}`
                      : hasEvents 
                      ? `${dayEvents.length} événement(s)` 
                      : ''
                  }
                >
                  {format(day, 'd')}
                  {/* Indicateur de multiple groupes */}
                  {hasGroupes && activeGroupes.length > 1 && (
                    <span className="absolute top-0 right-0 w-1 h-1 bg-purple-600 rounded-full"></span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Liste des groupes GIR actifs */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">
          Groupes GIR actifs ({groupesGIR.filter(g => g.statut === 'Actif').length})
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {groupesGIR
            .filter(g => g.statut === 'Actif')
            .map((groupe) => (
              <div
                key={groupe.id}
                className="bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{groupe.nom}</span>
                  <div 
                    className={`w-3 h-3 rounded-full ${getGroupeColor(groupe.id)}`}
                    title="Couleur du groupe dans le calendrier"
                  ></div>
                </div>
                {(groupe.dateEntree || groupe.dateSortie) && (
                  <div className="text-xs text-gray-600">
                    {groupe.dateEntree && format(new Date(groupe.dateEntree), 'dd/MM/yyyy')}
                    {groupe.dateEntree && groupe.dateSortie && ' → '}
                    {groupe.dateSortie && format(new Date(groupe.dateSortie), 'dd/MM/yyyy')}
                  </div>
                )}
              </div>
            ))}
          {groupesGIR.filter(g => g.statut === 'Actif').length === 0 && (
            <p className="text-xs text-gray-500 text-center py-4">
              Aucun groupe GIR actif
            </p>
          )}
        </div>
      </div>

      {/* Liste des groupes d'utilisateurs */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 uppercase mb-3">
          Groupes utilisateurs ({Object.keys(groupes).length})
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
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
