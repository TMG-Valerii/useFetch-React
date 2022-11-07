import { useState, useRef, useCallback } from 'react';

export const useRequest = (address = "") => {
  const [text, setText] = useState(null);
  const [json, setJson] = useState(null);
  const [status, setStatus] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const controller = useRef(null);
  const response = useRef(null);

  const request = useCallback(async (options = {}) => {
    if (controller.current) controller.current.abort();
    controller.current = new AbortController();
    const {signal} = controller.current;

    const {type: method = "GET", query = {}, data = {}} = options;
    const body = (/GET/i).test(method) ? null : JSON.stringify(data);
    
    try {
      setLoading(true);
      response.current = await fetch(`${address}?${new URLSearchParams(query)}`, {method, body, signal, cache: "no-cache"});

      const [text = null, json = null] = await Promise.all([
        response.current?.clone().text(),
        response.current?.clone().json(),
      ]);

      setText(text);
      setJson(json);
    }
    catch(error) {
      setText(null);
      setJson(null);
    }
    setLoading(false);

    setStatus(response.current?.status || null);
    setSuccess(response.current?.ok || false);

    return {text, json, status, success};
  }, []);

  return {text, json, status, success, loading, request};
}
