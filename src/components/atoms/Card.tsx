export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl shadow-xl p-8">{children}</div>
}