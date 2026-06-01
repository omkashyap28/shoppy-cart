import React from "react"

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="px-4 sm:px-6 md:px-10">{children}</div>
}
