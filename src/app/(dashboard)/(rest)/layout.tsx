import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <main className="flex-1">
                {children}
            </main>
        </>
    )
}

export default Layout;