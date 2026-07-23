function OptionBox({ x, y, isOpen, setIsOpen, children }) {
    return (
        { isOpen && (
            (<div
                style={{
                    position: "absolute",
                    top: y,
                    left: x,
                }}
            >
                {children}
            </div>)
        }
    )
}