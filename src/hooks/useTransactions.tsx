import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api';


interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string
}

type TransactionsInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
    children: React.ReactNode;
}

interface TransactionsContextData {
    transactions: Transaction[],
    createTransaction: (transaction: TransactionsInput) => Promise<void>
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);


export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    }, [])

    async function createTransaction(transactionInput: TransactionsInput) {
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date()
        })
        const { transaction } = response.data;

        setTransactions([
            ...transactions,
            transaction
        ])
    }

    return (
        <TransactionsContext.Provider value={{ transactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}

export function useTransition() {
    const context = useContext(TransactionsContext);

    return context;
}