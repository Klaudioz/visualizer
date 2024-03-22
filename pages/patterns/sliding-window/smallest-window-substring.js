import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function SmallestWindowSubstring({ state, inputs }) {
  const { done, start, end, result, explanation } = state
  const { str, pattern } = inputs
  const isActive = (index) => (done ? result[0] <= index && index <= result[1] : index >= start && index <= end)

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
          <code className="block">Pattern: {pattern}</code>
          <code className="block">Result: {done ? (result.length > 0 ? str.slice(result[0], result[1] + 1) : '""') : 'In progress...'}</code>
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
    title: 'Smallest Window containing Substring',
    pattern: 'Sliding Window',
    description:
      'Given a string and a pattern, find the smallest substring in the given string which has all the characters of the given pattern.',
    algorithm: smallestWindowSubstring,
    inputs: {
      str: 'abdabca',
      pattern: 'abc',
    },
  },
  SmallestWindowSubstring
)

// --

function smallestWindowSubstring({ record }, { str, pattern }) {
  const patternFrequency = {}
  for (const char of pattern) {
    if (!(char in patternFrequency)) {
      patternFrequency[char] = 0
    }
    patternFrequency[char] += 1
  }

  let windowStart = 0
  let matched = 0
  let minLength = str.length + 1
  let result = [0, str.length]

  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd]

    let explanation = `Adding character '${rightChar}' to the window.`

    if (rightChar in patternFrequency) {
      patternFrequency[rightChar] -= 1
      if (patternFrequency[rightChar] >= 0) {
        matched += 1
      }
    }

    while (matched === pattern.length) {
      const windowLength = windowEnd - windowStart + 1
      if (windowLength < minLength) {
        minLength = windowLength
        result = [windowStart, windowEnd]
        explanation = `Found a smaller window containing all characters of the pattern: ${str.slice(windowStart, windowEnd + 1)}`
      }

      const leftChar = str[windowStart]
      if (leftChar in patternFrequency) {
        if (patternFrequency[leftChar] === 0) {
          matched -= 1
        }
        patternFrequency[leftChar] += 1
      }
      windowStart += 1
    }

    record({
      start: windowStart,
      end: windowEnd,
      result,
      explanation,
    })
  }

  record({
    done: true,
    result,
    explanation: minLength <= str.length ? `The smallest substring containing all characters of the pattern is "${str.slice(result[0], result[1] + 1)}".` : `No substring in the given string has all characters of the pattern.`,
  })

  return minLength <= str.length ? str.slice(result[0], result[1] + 1) : ''
}