import React from 'react'
    import AdSidebar from '../components/AdSidebar'

    export default function LegalAreaTemplate({ title, description, services }) {
      return (
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="max-w-3xl mx-auto py-8 px-4">
              <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{title}</h1>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>{description}</p>
                <h2 className="text-xl font-bold mt-6 text-gray-800 dark:text-gray-200">Services Include:</h2>
                <ul className="list-disc list-inside space-y-2">
                  {services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <AdSidebar />
        </div>
      )
    }
