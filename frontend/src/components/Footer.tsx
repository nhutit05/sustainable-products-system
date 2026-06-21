export default function Footer() {
  return (
    <footer className="bg-green-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-center">
          &copy; {new Date().getFullYear()} GreenShop. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
