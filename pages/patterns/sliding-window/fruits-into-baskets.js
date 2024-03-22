import React from 'react'

import { Iterable, IterableItem } from '~components/Iterable'
import { makeAlgorithmPage } from '~lib/makeAlgorithmPage'
import { Window } from '~components/Window'

function FruitsIntoBaskets({ state, inputs }) {
  const { done, start, end, result, explanation } = state
  const { fruits } = inputs
  const isActive = (index) => (done ? result[0] <= index && index <= result[1] : index >= start && index <= end)

  return (
    <>
      <section className="pt-8">
        <Iterable>
          {Array.from(fruits).map((fruit, index) => (
            <IterableItem
              key={`${fruit}-${index}`}
              animate={isActive(index) ? 'active' : 'inactive'}
              className={{
                result: done && isActive(index),
              }}
            >
              {fruit}
            </IterableItem>
          ))}
          <Window show={!done} start={start} end={end} />
        </Iterable>
        <section className="mt-16">
          <code className="block">
            Result: {done ? `${result[1] - result[0] + 1} fruits` : 'In progress...'}
          </code>
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
    title: 'Fruits into Baskets',
    pattern: 'Sliding Window',
    description:
      'Given an array of characters where each character represents a fruit tree, find the maximum number of fruits that can be put into two baskets, where each basket can have only one type of fruit.',
    algorithm: fruitsIntoBaskets,
    inputs: {
      fruits: ['A', 'B', 'C', 'A', 'C'],
    },
  },
  FruitsIntoBaskets
)

// --

function fruitsIntoBaskets({ record }, { fruits }) {
  const fruitFrequency = {}
  let windowStart = 0
  let maxLength = 0
  let result = [0, 0]

  for (let windowEnd = 0; windowEnd < fruits.length; windowEnd++) {
    const rightFruit = fruits[windowEnd]
    if (!(rightFruit in fruitFrequency)) {
      fruitFrequency[rightFruit] = 0
    }
    fruitFrequency[rightFruit] += 1
    
    let explanation = `Adding fruit '${rightFruit}' to the window.`
    
    while (Object.keys(fruitFrequency).length > 2) {
      const leftFruit = fruits[windowStart]
      fruitFrequency[leftFruit] -= 1
      if (fruitFrequency[leftFruit] === 0) {
        delete fruitFrequency[leftFruit]
      }
      windowStart++
      explanation = `Shrinking the window by removing fruit '${leftFruit}' to have only two types of fruits.`
    }

    const currentLength = windowEnd - windowStart + 1
    if (currentLength > maxLength) {
      maxLength = currentLength
      result = [windowStart, windowEnd]
      explanation = `Found a new maximum number of fruits: ${maxLength}`
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
    explanation: `The maximum number of fruits that can be put into two baskets is ${maxLength}.`,
  })

  return maxLength
}