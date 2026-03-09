export const ALERT_MESSAGES = {
  CREATE_SUCCESSFULLY: 'alert form create successfully',
  CREATE_FAILED: 'create failed',
  UPDATE_SUCCESSFULLY: 'alert form update successfully',
  UPDATE_FAILED: 'update failed',
  UNIT_ID_REQUIRED: 'Unit ID is required',
  UNIT_ID_INVALID: 'Unit ID must be a valid MongoDB ObjectId',

  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_INVALID: 'Quantity must be a positive integer',
  URGENCY_REQUIRED: 'Urgency level is required',
  URGENCY_INVALID: 'Urgency level must be one of STANDARD, MEDIUM, HIGH, CRITICAL',
  APPOINTMENT_DATE_REQUIRED: 'Appointment date is required',
  APPOINTMENT_DATE_INVALID: 'Invalid appointment date format',

  NOTE_INVALID: 'Note must be a string',
  STATUS_INVALID: 'Invalid status',
  ALERT_NOT_FOUND: 'Alert not found',

  CONTACT_OWNER_NAME_INVALID: 'Contact owner name must be a string',
  CONTACT_OWNER_PHONE_INVALID: 'Invalid contact owner phone number',
  DELETE_SUCCESSFULLY: 'delete successfully',
  DELETE_FAILED: 'delete failed',
  RESOLVE_SUCCESSFULLY: 'resolve successfully'
}
