# Working Hours Implementation for Doctor Registration

## Overview
Added working hours functionality to allow doctors to specify their working hours during registration. These hours are used to control appointment availability and ensure consultations are only scheduled during working times.

## Changes Made

### 1. Frontend - Registration Page (`client/src/pages/RegisterPage.jsx`)
- Added `working_hours_start` and `working_hours_end` to the `initialDoctor` state with default values:
  - `working_hours_start: "09:00"`
  - `working_hours_end: "17:00"`
- Added time input fields in the doctor registration form:
  - "Working Hours Start" (required)
  - "Working Hours End" (required)
- These fields are only shown when the "Doctor" role is selected

### 2. Backend - Authentication Controller (`server/src/controllers/authController.js`)
- Updated the `register` function to capture and save working hours when creating a doctor record:
  ```javascript
  working_hours_start: parsedDoctor?.working_hours_start || "09:00",
  working_hours_end: parsedDoctor?.working_hours_end || "17:00",
  ```

### 3. Backend - Appointment Controller (`server/src/controllers/appointmentController.js`)
- Enhanced the `bookAppointment` function to validate appointment times against doctor's working hours
- Added validation logic that:
  - Retrieves the doctor's profile to get working hours
  - Compares the requested appointment time with working hours
  - Returns an error if the appointment falls outside working hours
- Error message format: `"Appointment must be within doctor's working hours (HH:MM - HH:MM)"`

### 4. Backend - Doctor Model (`server/src/models/Doctor.js`)
- Already had `working_hours_start` and `working_hours_end` fields with defaults:
  - Default start: "09:00"
  - Default end: "17:00"

### 5. Frontend - Doctor Settings Page (`client/src/pages/DoctorSettings.jsx`)
- Already implements working hours field editing
- Allows doctors to update their working hours after registration
- Uses the existing profile update endpoint

### 6. Backend - Profile Update Endpoint (`server/src/controllers/authController.js`)
- The `updateProfile` function already supports updating working hours
- Doctors can modify their working hours from the settings page

## Features

### During Registration
- Doctors enter start and end times during signup
- Default values provided (9 AM to 5 PM)
- Fields are required

### After Registration
- Doctors can edit working hours in Settings page
- Changes take effect immediately

### During Appointment Booking
- When a patient tries to book an appointment:
  - Time is validated against doctor's working hours
  - If outside working hours, booking is rejected
  - Clear error message shows the doctor's available hours

## Database Fields
The Doctor model stores:
- `working_hours_start` (String, format: "HH:MM", default: "09:00")
- `working_hours_end` (String, format: "HH:MM", default: "17:00")

## API Endpoints

### Registration
- **POST** `/api/auth/register`
- Accepts `working_hours_start` and `working_hours_end` in doctor data

### Update Profile
- **PUT** `/api/auth/profile`
- Can update `working_hours_start` and `working_hours_end`

### Book Appointment
- **POST** `/api/appointments`
- Validates appointment time against doctor's working hours

## User Flow

### Doctor Registration Flow
1. Doctor selects "Doctor" role
2. Fills in standard fields (name, email, phone, etc.)
3. Fills in specialization fields (specialization, license, experience, etc.)
4. **NEW**: Sets working hours (start and end time)
5. Completes registration

### Patient Appointment Booking Flow
1. Patient selects specialization and doctor
2. Selects appointment date
3. System fetches available time slots
4. Patient selects time slot
5. **NEW**: Backend validates time is within doctor's working hours
6. If valid: appointment is created
7. If invalid: error message shows doctor's available hours

## Error Handling
- If doctor profile not found: Returns 404 error
- If appointment time is outside working hours: Returns 400 error with message
- Backend gracefully handles missing or invalid time formats

## Testing Recommendations
1. Register a doctor with specific working hours
2. Try to book appointments within and outside those hours
3. Verify error message displays correct hours
4. Edit working hours in settings and verify changes
5. Test boundary times (exactly at start/end times)
