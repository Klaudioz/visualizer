import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function MaximumSumSubarray({ state, inputs }) {
  const { done, start, end, maxSum } = state
  const { arr, k } = inputs
  const isActive = (index) => (done ? true : index >= start && index <= end)

  return (
    <>
      <section className="pt-8">
        <Iterable>
          {Array.from(arr).map((item, index) => (
            <IterableItem
              key={`${item}-${index}`}
              animate={isActive(index) ? 'active' : 'inactive'}
              className={{
                result: done,
              }}
            >
              {item}
            </IterableItem>
          ))}
          <Window show={!done} start={start} end={end} />
        </Iterable>
        <section className="mt-16">
          <code className="block">Subarray size: {k}</code>
          <code className="block">Max sum: {maxSum}</code>
        </section>
      </section>
    </>
  )
}

export default makeAlgorithmPage(
  {
    title: 'Maximum Sum Subarray',
    pattern: 'Sliding Window',
    description:
      'Given an array, find the subarray of size k with the maximum sum.',
    algorithm: findMaxSumSubarray,
    inputs: {
      arr: [2, 1, 5, 1, 3, 2],
      k: 3,
    },
  },
  MaximumSumSubarray
)

// --

function findMaxSumSubarray({ record }, { arr, k }) {
  let windowStart = 0
  let windowSum = 0
  let maxSum = Number.NEGATIVE_INFINITY

  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]
    record({
      start: windowStart,
      end: windowEnd,
      sum: windowSum,
      maxSum,
    })

    if (windowEnd >= k - 1) {
      maxSum = Math.max(maxSum, windowSum)
      windowSum -= arr[windowStart]
      windowStart++
    }
  }

  record({
    done: true,
    maxSum,
  })

  return maxSum
}