import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function LongestSubstringAfterReplacement({ state, inputs }) {
  const { done, start, end, result, explanation } = state
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
          <code className="block">Max replacements allowed (k): {k}</code>
          <code className="block">Max length: {done ? result[1] - result[0] + 1 : 'In progress...'}</code>
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
    title: 'Longest Substring with Same Letters after Replacement',
    pattern: 'Sliding Window',
    description:
      "Given a string with lowercase letters only, if you are allowed to replace no more than 'k' letters with any letter, find the length of the longest substring having the same letters after replacement.",
    algorithm: longestSubstringAfterReplacement,
    inputs: {
      str: 'aabccbb',
      k: 2,
    },
  },
  LongestSubstringAfterReplacement
)

// --

function longestSubstringAfterReplacement({ record }, { str, k }) {
  const charFrequency = {}
  let windowStart = 0
  let maxLength = 0
  let maxRepeatLetterCount = 0
  let result = [0, 0]

  for (let windowEnd = 0; windowEnd < str.length; windowEnd++) {
    const rightChar = str[windowEnd]
    if (!(rightChar in charFrequency)) {
      charFrequency[rightChar] = 0
    }
    charFrequency[rightChar] += 1

    maxRepeatLetterCount = Math.max(maxRepeatLetterCount, charFrequency[rightChar])

    let explanation = `Adding character '${rightChar}' to the window.`

    if (windowEnd - windowStart + 1 - maxRepeatLetterCount > k) {
      const leftChar = str[windowStart]
      charFrequency[leftChar] -= 1
      windowStart++
      explanation = `Shrinking the window by removing character '${leftChar}' to satisfy the replacement condition. Replacements needed: ${windowEnd - windowStart + 1 - maxRepeatLetterCount}, Allowed replacements (k): ${k}`
    }

    const currentLength = windowEnd - windowStart + 1
    if (currentLength > maxLength) {
      maxLength = currentLength
      result = [windowStart, windowEnd]
      explanation = `Found a new maximum length substring: ${str.slice(windowStart, windowEnd + 1)}`
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
    explanation: `The length of the longest substring with same letters after replacement is ${maxLength}.`,
  })

  return maxLength
}