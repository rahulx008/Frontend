export default function BodyContainer({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 relative overflow-hidden">

            {/* Background Shapes */}
            <div className="absolute top-20 left-0 w-80 h-80 bg-white/10 rotate-45 rounded-3xl"></div>
            <div className="absolute bottom-0 left-40 w-96 h-96 bg-white/5 rotate-45 rounded-3xl"></div>
            <div className="absolute top-40 right-0 w-72 h-72 bg-black/10 rotate-45 rounded-3xl"></div>

            <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8 z-10">
                {children}
            </div>
        </div>
    )
}