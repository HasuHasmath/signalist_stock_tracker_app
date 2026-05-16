import Header from '@/components/Header'

const Layout = ({children}:{children : React.ReactNode}) => {
    return (
        <main className="h-min-screen text-gray-400">
            <Header/>
            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}
export default Layout
