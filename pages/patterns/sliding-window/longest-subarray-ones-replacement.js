import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function LongestSubarrayOnesReplacement({ state, inputs }) {
  const { done, start, end, result, explanation } = state
  const { arr, k } = inputs
  const isActive = (index) => (done ? result[0] <= index && index <= result[1] : index >= start && index <= end)

  return (
    <>
      <section className="pt-8">
        <Iterable>
          {Array.from(arr).map((num, index) => (
            <IterableItem
              key={`${num}-${index}`}
              animate={isActive(index) ? 'active' : 'inactive'}
              className={{
                result: done && isActive(index),
              }}
            >
              {num}
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
    title: 'Longest Subarray with Ones after Replacement',
    pattern: 'Sliding Window',
    description:
      "Given an array containing 0s and 1s, if you are allowed to replace no more than 'k' 0s with 1s, find the length of the longest contiguous subarray having all 1s.",
    algorithm: longestSubarrayOnesReplacement,
    inputs: {
      arr: [0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1],
      k: 2,
    },
  },
  LongestSubarrayOnesReplacement
)

// --

function longestSubarrayOnesReplacement({ record }, { arr, k }) {
  let windowStart = 0
  let maxLength = 0
  let maxOnesCount = 0
  let result = [0, 0]

  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    if (arr[windowEnd] === 1) {
      maxOnesCount++
    }

    let explanation = `Adding number '${arr[windowEnd]}' to the window.`

    if (windowEnd - windowStart + 1 - maxOnesCount > k) {
      if (arr[windowStart] === 1) {
        maxOnesCount--
      }
      windowStart++
      explanation = `Shrinking the window by removing number '${arr[windowStart - 1]}' to satisfy the replacement condition. Replacements needed: ${windowEnd - windowStart + 1 - maxOnesCount}, Allowed replacements (k): ${k}`
    }

    const currentLength = windowEnd - windowStart + 1
    if (currentLength > maxLength) {
      maxLength = currentLength
      result = [windowStart, windowEnd]
      explanation = `Found a new maximum length subarray: [${windowStart}, ${windowEnd}]`
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
    explanation: `The length of the longest subarray with ones after replacement is ${maxLength}.`,
  })

  return maxLength
}