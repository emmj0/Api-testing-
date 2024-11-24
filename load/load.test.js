const axios = require('axios');

const numRequests = 1000; 
const url = 'http://localhost:3000/products'; 
let latencyThreshold = 500; 

const loadTest = async () => {
  const requests = [];
  for (let i = 0; i < numRequests; i++) {
    const startTime = Date.now();
    requests.push(
      axios
        .get(url)
        .then((response) => ({
          status: response.status,
          latency: Date.now() - startTime,
        }))
        .catch((error) => ({
          status: error.response?.status || 500,
          latency: Date.now() - startTime,
        }))
    );
  }

  return Promise.all(requests); 
};

describe('Performance Test for Products API', () => {
  it('should handle 1000 requests and meet latency requirements', async () => {
    console.time('Load Test Duration'); 

    try {
      const results = await loadTest();
      console.timeEnd('Load Test Duration'); 

      expect(results.length).toBe(numRequests);

      const latencies = [];
      let successCount = 0;

      results.forEach((result) => {
        if (result.status === 200) {
          successCount++;
        }
        latencies.push(result.latency);
      });

      console.log('Latency Distribution:', {
        maxLatency: Math.max(...latencies),
        minLatency: Math.min(...latencies),
        medianLatency:
          latencies.sort((a, b) => a - b)[Math.floor(latencies.length / 2)],
      });

      const successPercent = (successCount / numRequests) * 100;
      console.log(`Successful Requests: ${successPercent.toFixed(2)}%`);
      expect(successPercent).toBeGreaterThanOrEqual(90); 

      const totalLatency = latencies.reduce((acc, curr) => acc + curr, 0);
      const avgLatency = totalLatency / numRequests;

      const belowThreshold = latencies.filter((l) => l < latencyThreshold);
      const belowThresholdPercent = (belowThreshold.length / numRequests) * 100;

      console.log(`Average Latency: ${avgLatency.toFixed(2)}ms`);
      console.log(`Requests under ${latencyThreshold}ms: ${belowThresholdPercent.toFixed(2)}%`);

      expect(belowThresholdPercent).toBeGreaterThanOrEqual(90); 
    } catch (error) {
      console.error('Error during load test:', error.message);
      throw error;
    }
  });
});
