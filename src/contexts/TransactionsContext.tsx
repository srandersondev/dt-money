import { ReactNode, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { createContext } from 'use-context-selector'

interface NewTransactionInput {
  description: string
  type: string
  category: string
  price: number
  createdAt: Date
}

interface Transaction {
  id: number
  description: string
  type: string
  category: string
  price: number
  createdAt: string
}

interface TransactionsContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: NewTransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)

export function TransactionProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }

  async function createTransaction(data: NewTransactionInput) {
    const { description, price, category, type } = data

    const response = await api.post('transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
