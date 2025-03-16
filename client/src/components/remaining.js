export function remainingText(remaining, name) {
  const categoryName = name ?? 'สิทธิ์คงเหลือ'
  const fundText =
    remaining?.fundRemaining != null || remaining?.fundRemaining != undefined
      ? `${remaining.fundRemaining} บาทต่อปี`
      : remaining?.perTimesRemaining != null || remaining?.perTimesRemaining != undefined
        ? `${remaining.perTimesRemaining} บาทต่อครั้ง`
        : 'ไม่จำกัดจำนวนเงิน'

  const requestsText =
    remaining?.requestsRemaining != null || remaining?.requestsRemaining != undefined
      ? `( ${remaining.requestsRemaining} ครั้ง)`
      : remaining?.perUsersRemaining
        ? `( ${remaining.requestsRemaining} ครั้งต่อผู้ใช้)`
        : '(ไม่จำกัดครั้ง)'

  return `${categoryName} : ${fundText} ${requestsText}`
}
