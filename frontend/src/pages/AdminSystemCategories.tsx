import { Search } from 'lucide-react'

export default function AdminSystemCategories() {
  return (
    <div className="admin_system-categories mt-20">
      {/* CATEGORIES HEADER SEARCH */}
      <header className="adm_system--search p-4 rounded-2xl shadow-md bg-white">
        <div className="search_group relative flex items-center gap-2 w-full">
          <Search className="text-green-800 absolute top-1/2 left-1 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục hệ thống"
            className="search_input w-full px-4 py-2 pl-8 rounded-lg border border-green-200 focus:outline-none focus:ring-1"
          />
        </div>
      </header>

      {/* CATEGORIES MAIN CONTENT */}
      <main className="mt-4">
        {/* Main content for system categories would go here */}

        {/* Section 1 */}
        <section className="grid grid-cols-5 gap-2">
          {/* OPTIONS CONFIG */}
          <aside className=" bg-white p-4  rounded-2xl shadow-md grid col-span-2">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {' '}
              Cấu hình Danh mục hệ thống
            </h3>
          </aside>

          {/* SHOW RESULT SIDE */}
          <section className="bg-white p-4 rounded-2xl shadow-md col-span-3">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {' '}
              Kết quả Danh mục hệ thống
            </h3>

            <div className="p-4 bg-sky-200 rounded-2xl h-40">
              Show table result of system categories will be displayed here
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}
