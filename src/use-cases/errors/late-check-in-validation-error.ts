export class LateCheckInValidateError extends Error {
  constructor() {
    super(
      'The Check-in can only be validated until 20 minutes of its creation.',
    )
  }
}
