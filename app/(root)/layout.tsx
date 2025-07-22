import { Toaster } from "@/components/ui/toaster"
import Navbar from "../../components/Navbar"

//this type tells TS props should be readonly (can't be modified) and it's generic and this generic should be of type "react node"
//so any react node is valid, we can say it can only be reactElement for example
function layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="font-work-sans">
      <Navbar />
      <Toaster/>
      {children}
    </main>
  )
}
export default layout