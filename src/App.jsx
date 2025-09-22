import { useEffect, useRef, useState } from 'react'
import './App.css'
import { URL } from './constants'
import Answer from './components/Answer'

function App() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState([])
  const scrollToAns = useRef()
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem('history')) || []
  )
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const askQuestion = async (customQuestion = '') => {
    const finalQuestion = customQuestion || question
    if (!finalQuestion.trim()) return
    const existing = history.find((h) => h.q === finalQuestion)
    if (existing) {
      setHistory((prev) => [...prev, existing])
      setQuestion('')
      return
    }

    if (localStorage.getItem('history')) {
      let h = JSON.parse(localStorage.getItem('history'))
      if (!h.includes(finalQuestion)) {
        h = [finalQuestion, ...h]
        localStorage.setItem('history', JSON.stringify(h))
        setRecentHistory(h)
      }
    } else {
      localStorage.setItem('history', JSON.stringify([finalQuestion]))
      setRecentHistory([finalQuestion])
    }

    setLoading(true)
    try {
      const payload = {
        contents: [{ parts: [{ text: finalQuestion }] }],
      }
      let response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      response = await response.json()
      let dataString =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      let arr = dataString
        .split('* ')
        .map((item) => item.trim())
        .filter(Boolean)

      setHistory((prev) => [...prev, { q: finalQuestion, a: arr }])
      setQuestion('')

      setTimeout(() => {
        if (scrollToAns.current) {
          scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight
        }
      }, 100)
    } catch (error) {
      console.error('Error in askQuestion:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    localStorage.clear()
    setRecentHistory([])
    setHistory([])
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 h-screen text-center relative">
        {/* Sidebar */}
        <div
          className={`col-span-1 bg-[#202123] z-20 fixed md:static top-0 left-0 h-full w-64 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <h1 className="text-center text-2xl font-bold mt-5 flex justify-center bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
            Recent Search
            <button onClick={clearHistory} className="cursor-pointer ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
            </button>
          </h1>

          <ul className="m-5 overflow-auto">
            {recentHistory &&
              recentHistory.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => askQuestion(item)}
                  className="text-zinc-300 truncate text-left hover:bg-zinc-700 hover:rounded-3xl p-2 cursor-pointer"
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>

        {/* Toggle Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 md:hidden z-30 rounded-lg pt-2 text-white"
        >
          ☰
        </button>

        {/* Main Content */}
        <div className="col-span-4 md:p-10 p-4 flex flex-col">
          <h1 className="text-2xl md:text-3xl mb-5 bg-clip-text text-transparent font-bold italic bg-gradient-to-r from-green-700 to-violet-700">
            Hello User, Ask Me Anything
          </h1>
          <div
            ref={scrollToAns}
            className="container h-130 overflow-y-scroll scroll-hide focus:outline-none"
          > 
            <div className="text-white space-y-6 pb-20 md:pb-0">
              {history.map((entry, idx) => (
                <div key={idx} className="mb-6">
                  <Answer ans={entry.q} index={0} totalResult={1} type="q" />
                  <ul>
                    {entry.a.map((item, index) => (
                      <li className="text-left" key={index}>
                        <Answer
                          ans={item}
                          index={index}
                          totalResult={entry.a.length}
                          type="a"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {loading && (
                <p className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-violet-700 text-xl text-center mt-5">
                  Thinking...
                </p>
              )}
            </div>
          </div> 
          <div className="flex p-1 justify-center items-center bg-zinc-800 rounded-4xl text-white w-full md:w-1/2 m-auto border border-zinc-600 h-14 mt-4 md:static fixed bottom-3 left-0">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
              className="w-full h-full p-3 border-none focus:outline-none bg-transparent"
              placeholder="Ask me Anything"
            />
            <button
              onClick={() => askQuestion()}
              disabled={loading}
              className="p-3"
            >
              {loading ? '...' : 'Ask'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
export default App