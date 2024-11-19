import { ClipLoader } from "react-spinners";


interface SpinnerProps {
    color?: string,
    loading: boolean,
    size?: number
}

export default function Spinner({color, loading, size=14} : SpinnerProps) {
    return (
        <span>
            <ClipLoader
                color={color || "#ffffff"}
                loading={loading}
                size={size}
                aria-label="Loading Spinner"
                data-testid="loader"
                className="flex items-center justify-center"
            />
        </span>
    )
}
