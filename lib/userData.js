import { getToken } from './authenticate';

export async function getFavourites(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/getfavs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json();
}

export async function addFavourites(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favourites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to add to favourites.');
  }
  return response.json();
}

export async function deleteFavourites(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deletefavs`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to delete favourites');
  }
  return response.json();
}

export async function deleteAllFavourites(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deleteallfavs`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to delete all favourites');
  }
  return response.json();
}

export async function getHistory(userData) {
    const token = getToken();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/gethistory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}

export async function addHistory(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to add history');
  }
  return response.json();
}

export async function deleteHistory(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deletehistory`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to delete history');
  }
  return response.json();
}

export async function deleteAllHistory(userData) {
  const token = getToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/deleteallhistory`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    throw new Error('Failed to delete history');
  }
  return response.json();
}