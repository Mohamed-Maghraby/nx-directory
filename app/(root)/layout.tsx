import { Toaster } from "@/components/ui/toaster"
import Navbar from "../../components/Navbar"

/**
 * The root layout of the app.
 * Root page and other layout and pages get's rendered here as children (next handles this)
 * All Top-level files (loading, error, etc..) including those in the nested routes get's rendered here with a certain hierarchy.
 * Top-level files in nested routes + the page get's rendered in it's layout if the a layout file exists , and all get's rendered in the
 * root layout.
 * 
 * Component Type: tells TS props should be readonly (can't be modified) and it's generic and this generic should be of type "react node"
 * so any react node is valid, we can say it can only be reactElement for example
 */ 

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