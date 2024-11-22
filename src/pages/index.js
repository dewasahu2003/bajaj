
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [inputJson, setInputJson] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate JSON
      const parsedJson = JSON.parse(inputJson);
      
      const response = await fetch('/api/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJson)
      });

      const data = await response.json();
      if (!data.is_success) {
        throw new Error(data.message || 'Request failed');
      }
      
      setResponse(data);
    } catch (err) {
      setError(err instanceof SyntaxError ? 'Invalid JSON format' : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelectedData = () => {
    if (!response || selectedOptions.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        {selectedOptions.includes('Numbers') && (
          <div className="mb-3">
            <h3 className="font-semibold">Numbers:</h3>
            <p>{response.numbers.join(', ') || 'No numbers found'}</p>
          </div>
        )}
        
        {selectedOptions.includes('Alphabets') && (
          <div className="mb-3">
            <h3 className="font-semibold">Alphabets:</h3>
            <p>{response.alphabets.join(', ') || 'No alphabets found'}</p>
          </div>
        )}
        
        {selectedOptions.includes('Highest lowercase alphabet') && (
          <div className="mb-3">
            <h3 className="font-semibold">Highest Lowercase Alphabet:</h3>
            <p>{response.highest_lowercase_alphabet.join(', ') || 'No lowercase alphabets found'}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>0101EC211045</title> 
        <meta name="description" content="Bajaj" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Bajaj</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="json-input" className="block text-sm font-medium text-gray-700">
                Enter JSON Input
              </label>
              <textarea
                id="json-input"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={4}
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder={'{ "data": ["A","1","B","2"] }'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {response && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data to Display
              </label>
              <select
                multiple
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={selectedOptions}
                onChange={(e) => setSelectedOptions([...e.target.selectedOptions].map(option => option.value))}
              >
                <option value="Numbers">Numbers</option>
                <option value="Alphabets">Alphabets</option>
                <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
              </select>

              {renderSelectedData()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}