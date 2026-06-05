'use client'
import { useItinerary } from '../../components/ItineraryProvider'
import { useTripDetail } from '../../hooks/useItineraryData'
import ActivityItem from '../../components/ActivityItem'

export default function TripDetailPage() {
  const { selectedTripId, moveActivityUp, moveActivityDown, removeActivity, navigate } =
    useItinerary()
  const { trip, groups, total } = useTripDetail(selectedTripId)

  if (!trip) {
    return (
      <section data-testid="page-trip-detail">
        <p data-testid="no-trip">No trip selected.</p>
        <button data-testid="back-to-trips" onClick={() => navigate('trips')}>
          Back
        </button>
      </section>
    )
  }

  return (
    <section data-testid="page-trip-detail">
      <h1 data-testid="detail-name">{trip.name}</h1>
      <p data-testid="detail-total">{total}</p>
      {groups.map((g) => (
        <div key={g.day} data-testid={`day-${g.day}`}>
          <h2 data-testid={`day-${g.day}-label`}>Day {g.day}</h2>
          <span data-testid={`day-${g.day}-cost`}>{g.cost}</span>
          {g.activities.length === 0 ? (
            <p data-testid={`day-${g.day}-empty`}>Nothing planned.</p>
          ) : (
            <ul data-testid={`day-${g.day}-list`}>
              {g.activities.map((a, idx) => (
                <ActivityItem
                  key={a.id}
                  activity={a}
                  isFirst={idx === 0}
                  isLast={idx === g.activities.length - 1}
                  onUp={moveActivityUp}
                  onDown={moveActivityDown}
                  onRemove={removeActivity}
                />
              ))}
            </ul>
          )}
        </div>
      ))}
      <button data-testid="add-activity-link" onClick={() => navigate('add-activity')}>
        Add activity
      </button>
    </section>
  )
}
