import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 100 },   
    { duration: '2m', target: 1000 },  
    { duration: '3m', target: 5000 },  
    { duration: '2m', target: 5000 },  
    { duration: '1m', target: 0 },     
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'],  
    errors: ['rate<0.1'],              
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export function setup() {
  const loginRes = http.post(`${BASE_URL}/auth/student/login`, JSON.stringify({
    register_number: '714024149040',
    date_of_birth: '2005-05-08',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('access_token');
  return { token };
}

export default function (data) {
  const params = {
    headers: {
      'Authorization': `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    },
  };

  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health check 200': (r) => r.status === 200,
  });

  const resultsRes = http.get(`${BASE_URL}/results/me`, params);
  const success = check(resultsRes, {
    'results 200': (r) => r.status === 200,
    'results < 2s': (r) => r.timings.duration < 2000,
  });

  errorRate.add(!success);
  sleep(1);
}

export function teardown(data) {
  console.log('Load test complete');
}