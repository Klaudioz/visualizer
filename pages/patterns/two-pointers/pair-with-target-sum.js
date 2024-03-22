import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'

function PairWithTargetSum({ state, inputs }) {
  const { done, left, right, result } = state
  const { nums, target } = inputs
  const isActive = (index) => (done && result === null) || index === left || index === right
  const showPointer = (index) => (done ? false : isActive(index))

  return (
    <>
      <section>
        <Iterable>
          {nums.map((item, index) => (
            <IterableItem
              key={`${item}-${index}`}
              active={isActive(index)}
              className={{
                'not-found': done && !result,
                result: done && result && result.includes(index),
              }}
              pointer={showPointer(index)}
            >
              {item}
            </IterableItem>
          ))}
        </Iterable>
      </section>
      <section className="mt-8">
        <code className="block">Target: {target}</code>
        {done && result ? (
          <>
            <code className="block">Output: [{result[0]}, {result[1]}]</code>
            <code className="block">
              Explanation: The numbers at index {result[0]} and {result[1]} add up to {target}: {nums[result[0]]}+{nums[result[1]]}={target}
            </code>
          </>
        ) : (
          <code className="block">{done ? 'Not found :(' : 'Searching...'}</code>
        )}
      </section>
    </>
  )
}

export default makeAlgorithmPage(
  {
    title: 'Pair with Target Sum',
    pattern: 'Two Pointers',
    description:
      'Given an array of sorted numbers and a target sum, find a pair in the array whose sum is equal to the given target.',
    algorithm: pairWithTargetSum,
    inputs: {
      nums: [1, 2, 3, 4, 6],
      target: 6,
    },
  },
  PairWithTargetSum
)

// --

function pairWithTargetSum({ record }, { nums, target }) {
  let left = 0
  let right = nums.length - 1

  while (left < right) {
    const leftNum = nums[left]
    const rightNum = nums[right]

    record({
      left,
      right,
      done: false,
    })

    if (leftNum + rightNum === target) {
      record({
        left,
        right,
        done: true,
        result: [left, right],
      })
      return [left, right]
    }

    if (leftNum + rightNum > target) {
      right--
    } else {
      left++
    }
  }

  record({
    done: true,
    result: null,
  })

  return null
}