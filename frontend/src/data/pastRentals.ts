import { backpack01, ladder01, pressureWasher01, tent01, tools01 } from "../utils/images"

export type PastRental = {
  id: number
  image: string
  title: string
  date: string
  duration: string
  amount: string
  amountValue: number
}

export const pastRentals: PastRental[] = [
  { id: 5, image: backpack01, title: "Air Jordan 1 Retro", date: "Oct 2023", duration: "2 Days", amount: "NPR 1,600", amountValue: 1600 },
  { id: 6, image: tools01, title: "DeWalt Drill", date: "Sep 2023", duration: "1 Day", amount: "NPR 350", amountValue: 350 },
  { id: 7, image: ladder01, title: "Bose QC Headphones", date: "Aug 2023", duration: "3 Days", amount: "NPR 1,500", amountValue: 1500 },
  { id: 8, image: tent01, title: "4-Person Tent", date: "July 2023", duration: "5 Days", amount: "NPR 3,000", amountValue: 3000 },
  { id: 9, image: pressureWasher01, title: "Canon EOS R6 Kit", date: "Jun 2023", duration: "4 Days", amount: "NPR 7,200", amountValue: 7200 },
  { id: 10, image: tools01, title: "Sony A7R IV Kit", date: "May 2023", duration: "2 Days", amount: "NPR 1,998", amountValue: 1998 },
  { id: 11, image: tent01, title: "North Face Tent", date: "Apr 2023", duration: "3 Days", amount: "NPR 1,800", amountValue: 1800 },
  { id: 12, image: backpack01, title: "MacBook Pro M1", date: "Mar 2023", duration: "7 Days", amount: "NPR 12,600", amountValue: 12600 },
  { id: 13, image: ladder01, title: "Ladder 8ft", date: "Feb 2023", duration: "1 Day", amount: "NPR 200", amountValue: 200 },
  { id: 14, image: pressureWasher01, title: "Pressure Washer", date: "Jan 2023", duration: "2 Days", amount: "NPR 1,400", amountValue: 1400 },
]
