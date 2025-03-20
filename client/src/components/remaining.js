export function remainingText(remaining, name) {
  const categoryName = name ?? 'สิทธิ์คงเหลือ'
  const fundText =
    remaining?.fundRemaining != null || remaining?.fundRemaining != undefined
      ? `${remaining.fundRemaining} บาทต่อปี`
      : remaining?.perTimesRemaining != null || remaining?.perTimesRemaining != undefined
        ? `${remaining.perTimesRemaining} บาทต่อครั้ง`
        : 'ไม่จำกัดจำนวนเงิน'

  const requestsText =
    remaining?.requestsRemaining > 0
      ? `( ${remaining.requestsRemaining} ครั้ง)`
      : remaining?.perUsersRemaining > 0
        ? `( ${remaining.requestsRemaining} ครั้งต่อผู้ใช้)`
        : remaining?.requestsRemaining == null && remaining?.perUsersRemaining == null
          ? '(ไม่จำกัดครั้ง)'
          : '(ใช้สิทธิ์ครบแล้ว)'

  return `${categoryName} : ${fundText} ${requestsText}`
}
export function remainingTextOneForUsers(remaining, name) {
  const categoryName = name ?? 'สิทธิ์คงเหลือ'
  const fundText =
    remaining?.perUsersRemaining != null &&
    remaining?.perUsersRemaining !== undefined &&
    remaining?.perUsersRemaining <= 0
      ? ''
      : remaining?.fundRemaining != null && remaining?.fundRemaining !== undefined
        ? `${remaining.fundRemaining} บาท`
        : remaining?.perTimesRemaining != null && remaining?.perTimesRemaining !== undefined
          ? `${remaining.perTimesRemaining} บาทต่อครั้ง`
          : 'ไม่จำกัดจำนวนเงิน'

  const requestsText =
    remaining?.perUsersRemaining != null && remaining?.perUsersRemaining !== undefined
      ? remaining.perUsersRemaining > 0
        ? `( ${remaining.perUsersRemaining} ครั้ง)`
        : 'ใช้สิทธิ์ครบแล้ว'
      : remaining?.requestsRemaining != null && remaining?.requestsRemaining !== undefined
        ? `( ${remaining.requestsRemaining} ครั้ง)`
        : '(ไม่จำกัดครั้ง)'

  return `${categoryName} : ${fundText} ${requestsText}`
}
