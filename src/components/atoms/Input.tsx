export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none"
      {...props}
    />
  )
}