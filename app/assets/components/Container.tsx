import type { ReactNode } from "react"
import "../css/container.css"

type WrapperProps = {
    children: ReactNode | ReactNode[]
}

const Container = ({ children }: WrapperProps) => {
  return (
    <div className="container-wrapper">
        {children}
    </div>
  );
}

export default Container