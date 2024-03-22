import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function LongestSubstringKDistinct({ state, inputs }) {
  const { done, start, end, result } = state
  const { str, k } = inputs
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
          <code className="block">K: {k}</code>
          <code className="block">
            Result: {done ? `"${str.slice(result[0], result[1] + 1)}"` : 'In progress...'}
          </code>
        </section>
      </section>
    </>
  )
}

export default makeAlgorithmPage(
  {
    title: 'Longest Substring with K Distinct Characters',
    pattern: 'Sliding Window',
    description:
      'Given a string, find the length of the longest substring in it with no more than K distinct characters.',
    algorithm: longestSubstringKDistinct,
    inputs: {
      str: 'araaci',
      k: 2,
    },
  },
  LongestSubstringKDistinct
)

// --

function longestSubstringKDistinct({ record }, { str, k }) {
  const charFrequency = {}
  let windowStart = 0
  let maxLength = 0
  let result = [0, 0]

  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd]
    if (!(rightChar in charFrequency)) {
      charFrequency[rightChar] = 0
    }
    charFrequency[rightChar] += 1
    record({
      start: windowStart,
      end: windowEnd,
      result,
    })

    while (Object.keys(charFrequency).length > k) {
      const leftChar = str[windowStart]
      charFrequency[leftChar] -= 1
      if (charFrequency[leftChar] === 0) {
        delete charFrequency[leftChar]
      }
      windowStart++
    }

    const currentLength = windowEnd - windowStart + 1
    if (currentLength > maxLength) {
      maxLength = currentLength
      result = [windowStart, windowEnd]
    }
    
    record({
      start: windowStart,
      end: windowEnd,
      result,
    })
  }

  record({
    done: true,
    result,
  })

  return maxLength
}