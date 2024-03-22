import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function WordsConcatenation({ state, inputs }) {
  const { done, start, end, result, explanation } = state
  const { str, words } = inputs
  const isActive = (index) => (done ? result.includes(index) : index >= start && index <= end)

  return (
    <>
      <section className="pt-8">
        <Iterable>
          {Array.from(str).map((char, index) => (
            <IterableItem
              key={`${char}-${index}`}
              animate={isActive(index) ? 'active' : 'inactive'}
              className={{
                result: done && isActive(index),
              }}
            >
              {char}
            </IterableItem>
          ))}
          <Window show={!done} start={start} end={end} />
        </Iterable>
        <section className="mt-16">
          <code className="block">Words: {JSON.stringify(words)}</code>
          <code className="block">Result: {done ? JSON.stringify(result) : 'In progress...'}</code>
          <code className="block mt-4">
            {explanation}
          </code>
        </section>
      </section>
    </>
  )
}

export default makeAlgorithmPage(
  {
    title: 'Words Concatenation',
    pattern: 'Sliding Window',
    description:
      'Given a string and a list of words, find all the starting indices of substrings in the given string that are a concatenation of all the given words exactly once without any overlapping of words.',
    algorithm: wordsConcatenation,
    inputs: {
      str: 'catfoxcat',
      words: ['cat', 'fox'],
    },
  },
  WordsConcatenation
)

// --

function wordsConcatenation({ record }, { str, words }) {
  const wordCount = words.length
  const wordLength = words[0].length
  const concatenationLength = wordCount * wordLength

  const wordFrequency = {}
  for (const word of words) {
    if (!(word in wordFrequency)) {
      wordFrequency[word] = 0
    }
    wordFrequency[word] += 1
  }

  const result = []

  for (let i = 0; i <= str.length - concatenationLength; i++) {
    const seenWords = {}
    let explanation = `Checking substring starting at index ${i}.`

    for (let j = 0; j < wordCount; j++) {
      const startIndex = i + j * wordLength
      const endIndex = startIndex + wordLength
      const currentWord = str.slice(startIndex, endIndex)

      record({
        start: i,
        end: endIndex - 1,
        result,
        explanation,
      })

      if (!(currentWord in wordFrequency)) {
        break
      }

      if (!(currentWord in seenWords)) {
        seenWords[currentWord] = 0
      }
      seenWords[currentWord] += 1

      if (seenWords[currentWord] > (wordFrequency[currentWord] || 0)) {
        break
      }

      if (j === wordCount - 1) {
        result.push(i)
        explanation = `Found a concatenation of all the words starting at index ${i}.`
      }
    }
  }

  record({
    done: true,
    result,
    explanation: result.length > 0 ? `The starting indices of substrings containing all the words are ${JSON.stringify(result)}.` : 'No substrings containing all the words were found.',
  })

  return result
}