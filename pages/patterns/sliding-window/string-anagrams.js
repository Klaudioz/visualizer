import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function StringAnagrams({ state, inputs }) {
  const { done, start, end, result, explanation } = state
  const { str, pattern } = inputs
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
          <code className="block">Pattern: {pattern}</code>
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
    title: 'String Anagrams',
    pattern: 'Sliding Window',
    description:
      'Given a string and a pattern, find all anagrams of the pattern in the given string.',
    algorithm: stringAnagrams,
    inputs: {
      str: 'abbcabc',
      pattern: 'abc',
    },
  },
  StringAnagrams
)

// --

function stringAnagrams({ record }, { str, pattern }) {
  const patternFrequency = {}
  for (const char of pattern) {
    if (!(char in patternFrequency)) {
      patternFrequency[char] = 0
    }
    patternFrequency[char] += 1
  }

  let windowStart = 0
  let matched = 0
  const result = []

  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd]

    let explanation = `Adding character '${rightChar}' to the window.`

    if (rightChar in patternFrequency) {
      patternFrequency[rightChar] -= 1
      if (patternFrequency[rightChar] === 0) {
        matched += 1
      }
    }

    if (matched === Object.keys(patternFrequency).length) {
      result.push(windowStart)
      explanation = `Found an anagram of the pattern at index ${windowStart}.`
    }

    if (windowEnd >= pattern.length - 1) {
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
    explanation: result.length > 0 ? `Found ${result.length} anagram(s) of the pattern in the string.` : `No anagrams of the pattern found in the string.`,
  })

  return result
}