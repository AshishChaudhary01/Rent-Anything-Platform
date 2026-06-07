import { IoStar } from "react-icons/io5"

const reviews = [
  {
    id: 1,
    user: "Ramesh Kumar",
    date: "2026/12/29",
    rating: 4.6,
    content: `Anish was incredibly helpful. The camera was in pristine condition and worked perfectly for my client's commercial shoot. Will definitely rent again!`,
  },
  {
    id: 2,
    user: "Ramesh Kumar",
    date: "2026/12/29",
    rating: 4.6,
    content: `Anish was incredibly helpful. The camera was in pristine condition and worked perfectly for my client's commercial shoot. Will definitely rent again!`,
  },
  {
    id: 3,
    user: "Ramesh Kumar",
    date: "2026/12/29",
    rating: 4.6,
    content: `Anish was incredibly helpful. The camera was in pristine condition and worked perfectly for my client's commercial shoot. Will definitely rent again!`,
  },
];

function ListingReview() {
  return (
    <div className="flex flex-col gap-y-8 p-6 font-light bg-white rounded-2xl shadow-xs">
      <div>
        <p className="text-lg md:text-2xl font-bold">User Reviews</p>
        <div className="flex gap-x-6">
          <div className="flex gap-x-2">
            <span className="flex items-center text-primary font-bold text-xl">4.6</span>
            <div className="flex items-center gap-x-1 text-yellow-400">
              <IoStar className=" size-4" />
              <IoStar className=" size-4" />
              <IoStar className=" size-4" />
              <IoStar className=" size-4" />
              <IoStar className=" size-4" />
            </div>
          </div>
          <div className="flex items-center">
            (3 Reviews)
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        {reviews.map((review) => (
          <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
            <div className="mb-2">
              <div className="flex justify-start gap-x-4">

                {/* User */}
                <div className="font-bold text-lg">{review.user}</div>

                {/* Rating */}
                <div className="flex gap-x-2">
                  <div className="flex font-semibold">{review.rating}</div>
                  <div className="flex gap-x-1 text-yellow-400">
                    <IoStar className="size-4" />
                    <IoStar className="size-4" />
                    <IoStar className="size-4" />
                    <IoStar className="size-4" />
                    <IoStar className="size-4" />
                  </div>
                </div>
              </div>
              <div className="text-sm">
                {review.date}
              </div>
            </div>
            <div className="text-lg">
              {review.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListingReview