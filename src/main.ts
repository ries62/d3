import './style.css'
import * as d3 from 'd3'

const bridges = [
  { name: 'Danyang–Kunshan Grand Bridge', length: 164800 },
  { name: 'Changhua–Kaohsiung Viaduct', length: 157317 },
  { name: 'Cangde Grand Bridge', length: 115900 },
  { name: 'Tianjin Grand Bridge', length: 113700 },
  { name: 'Weinan Weihe Grand Bridge', length: 79732 },
  { name: 'Bang Na Expressway', length: 55000 },
  { name: 'Beijing Grand Bridge', length: 48153 },
  { name: 'Lake Pontchartrain Causeway', length: 38624 },
  { name: 'Manchac Swamp Bridge', length: 36710 },
  { name: 'Yangcun Bridge', length: 35812 },
]

const margin = { top: 40, right: 30, bottom: 160, left: 80 }
const width = 900 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const palette = ['#cae5ff', '#acedff', '#89bbfe', '#6f8ab7', '#615d6c']
const hoverPalette = ['#a8ccee', '#8ad4ee', '#67a0ed', '#4e6a96', '#403c4b']

const svg = d3
  .select('#app')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

const x = d3
  .scaleBand()
  .domain(bridges.map(d => d.name))
  .range([0, width])
  .padding(0.25)

const y = d3
  .scaleLinear()
  .domain([0, d3.max(bridges, d => d.length)!])
  .nice()
  .range([height, 0])

// Gridlines
svg
  .append('g')
  .attr('class', 'grid')
  .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ''))

// Bars
svg
  .selectAll('.bar')
  .data(bridges)
  .join('rect')
  .attr('class', 'bar')
  .attr('x', d => x(d.name)!)
  .attr('y', d => y(d.length))
  .attr('width', x.bandwidth())
  .attr('height', d => height - y(d.length))
  .attr('fill', (_, i) => palette[i % palette.length])
  .on('mouseover', function(_, d) {
    const i = bridges.indexOf(d)
    d3.select(this).attr('fill', hoverPalette[i % hoverPalette.length])
  })
  .on('mouseout', function(_, d) {
    const i = bridges.indexOf(d)
    d3.select(this).attr('fill', palette[i % palette.length])
  })

// X axis
svg
  .append('g')
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll('text')
  .attr('transform', 'rotate(-40)')
  .style('text-anchor', 'end')
  .attr('dx', '-0.5em')
  .attr('dy', '0.15em')

// Y axis
svg.append('g').call(
  d3.axisLeft(y).tickFormat(d => `${(+d / 1000).toFixed(0)}km`)
)

// Y axis label
svg
  .append('text')
  .attr('transform', 'rotate(-90)')
  .attr('y', -65)
  .attr('x', -height / 2)
  .attr('text-anchor', 'middle')
  .attr('class', 'axis-label')
  .text('Length (km)')

// Title
svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', -15)
  .attr('text-anchor', 'middle')
  .attr('class', 'chart-title')
  .text('Ten Longest Bridges in the World')
