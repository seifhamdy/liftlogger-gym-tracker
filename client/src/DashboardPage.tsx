import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Card } from 'react-bootstrap'
import { getApiUrl } from './config/apiConfig'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Cookies from 'js-cookie'

interface Workout {
  date: string
  name: string
  weight: number
  sets: number
  reps: number
}

const DashboardPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [workouts, setWorkouts] = useState<Workout[]>([])

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const apiUrl = getApiUrl()
        const response = await fetch(`${apiUrl}/workouts`, {
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          const filteredWorkouts = data.filter(
            (workout: { date: string | number | Date }) =>
              formatDate(new Date(workout.date)) === formatDate(currentDate)
          )
          setWorkouts(filteredWorkouts)
        } else {
          console.log('Error:', response.statusText)
        }
      } catch (error) {
        console.log('Error:', error)
      }
    }

    fetchWorkouts()
  }, [currentDate, showModal])

  const [liftData, setLiftData] = useState({
    date: '',
    name: '',
    weight: '',
    sets: '',
    reps: '',
  })

  const [touched, setTouched] = useState({
    date: false,
    name: false,
    weight: false,
    sets: false,
    reps: false,
  })

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(prevDate.getDate() - 1)
      return newDate
    })
  }

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(prevDate.getDate() + 1)
      return newDate
    })
  }

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    setShowDatePicker(false)
  }

  const handleModalOpen = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setLiftData({
      date: '',
      name: '',
      weight: '',
      sets: '',
      reps: '',
    })
    setTouched({
      date: false,
      name: false,
      weight: false,
      sets: false,
      reps: false,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLiftData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }))
  }

  const handleLogout = async () => {
    try {
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/logout`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        window.location.href = '/'
      } else {
        console.log('Error:', response.statusText)
      }
    } catch (error) {
      console.log('Error:', error)
    }
  }
  const handleConfirm = async () => {
    try {
      const apiUrl = getApiUrl()
      const headers = new Headers({
        'Content-Type': 'application/json',
      })
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken) {
        headers.append('Authorization', jwtToken)
      }
      const response = await fetch(`${apiUrl}/workouts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workout: {
            date: liftData.date,
            name: liftData.name,
            weight: parseInt(liftData.weight),
            sets: parseInt(liftData.sets),
            reps: parseInt(liftData.reps),
          },
        }),
        credentials: 'include',
      })

      if (response.ok) {
        handleModalClose()
      } else {
        console.log('Error:', response.statusText)
      }
    } catch (error) {
      console.log('Error:', error)
    }
  }
  const isConfirmDisabled = !(
    liftData.date &&
    liftData.name &&
    liftData.weight &&
    liftData.sets &&
    liftData.reps
  )

  const validateNumberInput = (value: string) => {
    const parsedValue = parseInt(value, 10)
    return !isNaN(parsedValue) && parsedValue >= 0
  }

  const formatDate = (date: Date | null): string => {
    if (date) {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
      return date.toLocaleDateString(undefined, options)
    }
    return ''
  }

  return (
    <div className="bg-secondary" style={{ height: '100vh' }}>
      <nav className="navbar navbar-expand navbar-dark bg-dark justify-content-between">
        <div>
          <button className="btn btn-outline-light" onClick={handlePreviousDay}>
            Prev
          </button>
          <button
            className="btn btn-outline-light"
            onClick={() => setShowDatePicker(true)}
          >
            {formatDate(currentDate)}
          </button>
          <button className="btn btn-outline-light" onClick={handleNextDay}>
            Next
          </button>
        </div>
        <div>
          <button className="btn btn-light" onClick={handleModalOpen}>
            Add Lift
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Display workout cards */}
      {workouts.length > 0 ? (
        <div className="d-flex flex-wrap justify-content-center">
          {workouts.map((workout, index) => (
            <Card
              key={index}
              style={{ width: '95%' }}
              className="m-1 text-center bg-dark text-white rounded-lg"
            >
              <Card.Body>
                {workout && workout.name ? (
                  <>
                    <Card.Title className="display-4">
                      {workout.name}
                    </Card.Title>
                    <Card.Text className="display-6">
                      Weight: {workout.weight}
                      <br />
                      Sets: {workout.sets}
                      <br />
                      Reps: {workout.reps}
                    </Card.Text>
                  </>
                ) : (
                  <Card.Text>No workout data available.</Card.Text>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="display-3 text-center mt-5">
          No workout data available
        </div>
      )}

      {/* Rest of your dashboard content */}
      <Modal
        show={showDatePicker}
        onHide={() => setShowDatePicker(false)}
        centered
      >
        <Modal.Header>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePicker
            selected={currentDate}
            onChange={handleDateSelect}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className="form-control"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDatePicker(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header>
          <Modal.Title>Add Lift</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="lift-date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={liftData.date}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                isInvalid={touched.date && !liftData.date}
              />
            </Form.Group>
            <Form.Group controlId="lift-name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={liftData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                isInvalid={touched.name && !liftData.name}
              />
            </Form.Group>
            <Form.Group controlId="lift-weight">
              <Form.Label>Weight</Form.Label>
              <Form.Control
                type="number"
                name="weight"
                value={liftData.weight}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                min="0"
                isInvalid={
                  touched.weight && !validateNumberInput(liftData.weight)
                }
              />
            </Form.Group>
            <Form.Group controlId="lift-sets">
              <Form.Label>Sets</Form.Label>
              <Form.Control
                type="number"
                name="sets"
                value={liftData.sets}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                min="0"
                isInvalid={touched.sets && !validateNumberInput(liftData.sets)}
              />
            </Form.Group>
            <Form.Group controlId="lift-reps">
              <Form.Label>Reps</Form.Label>
              <Form.Control
                type="number"
                name="reps"
                value={liftData.reps}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                required
                min="0"
                isInvalid={touched.reps && !validateNumberInput(liftData.reps)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default DashboardPage
