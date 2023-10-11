'use client'

import { useEffect, useState } from "react"

export default function HomePage() {
  const [name, setName] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')
  const [total, setTotal] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const handleProcess = async () => {
    const dataPayment = {
      name: name,
      order_id: orderId,
      total: parseInt(total)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...dataPayment })
    })

    const data = await response.json();
    setToken(data.token)
  }

  useEffect(() => {
    if (token) {
      (window as any).snap.pay(token, {
        onSuccess: (result: any) => {
          localStorage.setItem('Payment', JSON.stringify(result))
          console.log('success', result)
          setToken('')
        },
        onPending: (result: any) => {
          localStorage.setItem('Payment', JSON.stringify(result))
          console.log('pending', result)
          setToken('')
        },
        onError: (error: any) => {
          console.log('error', error)
          setToken('')
        },
        onClose: () => {
          console.log('You close the popup without finishing the payment')
          setToken('')
        }
      })

      setName('')
      setOrderId('')
      setTotal('')
    }
  }, [token])

  useEffect(() => {
    const midtransSnapUrl = 'https://app.sandbox.midtrans.com/snap/snap.js'

    const scriptTag = document.createElement('script')
    scriptTag.src = midtransSnapUrl

    const midtransClientKey = process.env.MIDTRANS_SANDBOX_CLIENT_KEY
    scriptTag.setAttribute('data-client-key', midtransClientKey!)

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  return (
    <>
      <div className="flex justify-center h-screen">
        <div className="w-1/2">
          <div className="flex flex-col w-full gap-5 p-5">
            <input
              type="text"
              aria-label="Name"
              value={name}
              onChange={(event) => { setName(event.target.value) }}
              className="p-2 text-sm border border-gray-400 rounded"
            />
            <input
              type="text"
              aria-label="Order ID"
              value={orderId}
              onChange={(event) => { setOrderId(event.target.value) }}
              className="p-2 text-sm border border-gray-400 rounded"
            />
            <input
              type="number"
              aria-label="Total"
              value={total}
              onChange={(event) => { setTotal(event.target.value) }}
              className="p-2 text-sm border border-gray-400 rounded"
            />

            <button
              onClick={handleProcess}
              className="p-2 bg-black rounded"
            >
              <span className="text-sm text-white">Proceed</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
