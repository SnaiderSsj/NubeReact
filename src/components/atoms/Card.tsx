export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
      {children}
    </div>
  )
}