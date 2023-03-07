export function isEventActivated(event) {
  if (
    event 
    &&
    event.payment &&
    event.payment.activated 
    &&
    event.payment.totalCredits > 0 
    // &&
    // event.phoneNumbers &&
    // event.phoneNumbers.length > 0
  ) {
    return true;
  }

  return false;
}
