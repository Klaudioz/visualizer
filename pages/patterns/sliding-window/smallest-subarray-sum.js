import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function SmallestSubarraySum({ state, inputs }) {
  const { done, start, end, result } = state
  const { arr, target } = inputs
  const isActive = (index) => (done ? result[0] <= index && index <= result[1] : index >= start && index <= end)

  return (
    <>
      <section className="pt-8">
        <Iterable>
          {Array.from(arr).map((item, index) => (
            <IterableItem
              key={`${item}-${index}`}
              animate={isActive(index) ? 'active' : 'inactive'}
              className={{
                result: done && isActive(index),
              }}
            >
              {item}
            </IterableItem>
          ))}
          <Window show={!done} start={start} end={end} />
        </Iterable>
        <section className="mt-16">
          <code className="block">Target sum: {target}</code>
          <code className="block">
            Result: {done ? `[${result[0]}, ${result[1]}]` : 'In progress...'}
          </code>
        </section>
      </section>
    </>
  )
}

export default makeAlgorithmPage(
  {
    title: 'Smallest Subarray Sum',
    pattern: 'Sliding Window',
    description:
      "Given an array of positive numbers and a positive number 'S', find the length of the smallest contiguous subarray whose sum is greater than or equal to 'S'.",
    algorithm: smallestSubarraySum,
    inputs: {
      arr: [2, 1, 5, 2, 3, 2],
      target: 7,
    },
  },
  SmallestSubarraySum
)

// --

function smallestSubarraySum({ record }, { arr, target }) {
  let windowStart = 0
  let windowSum = 0
  let minLength = Infinity
  let result = [0, 0]

  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]
    record({
      start: windowStart,
      end: windowEnd,
      sum: windowSum,
      result,
    })

    while (windowSum >= target) {
      const currentLength = windowEnd - windowStart + 1
      if (currentLength < minLength) {
        minLength = currentLength
        result = [windowStart, windowEnd]
      }
      windowSum -= arr[windowStart]
      windowStart++
      record({
        start: windowStart,
        end: windowEnd,
        sum: windowSum,
        result,
      })
    }
  }

  record({
    done: true,
    result,
  })

  return minLength === Infinity ? 0 : minLength
}