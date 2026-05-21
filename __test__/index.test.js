afterEach(() => {});

// =====================
// TESTS DE BASE
// =====================
describe('Tests de base', () => {
  test('addition simple', () => {
    expect(1 + 1).toBe(2);
  });

  test('soustraction', () => {
    expect(10 - 3).toBe(7);
  });

  test('multiplication', () => {
    expect(3 * 4).toBe(12);
  });

  test('division', () => {
    expect(10 / 2).toBe(5);
  });
});

// =====================
// TESTS VALIDATION EMAIL
// =====================
describe('Validation email', () => {
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  test('email valide', () => {
    expect(isValidEmail('test@gmail.com')).toBe(true);
  });

  test('email sans @', () => {
    expect(isValidEmail('testgmail.com')).toBe(false);
  });

  test('email vide', () => {
    expect(isValidEmail('')).toBe(false);
  });

  test('email sans domaine', () => {
    expect(isValidEmail('test@')).toBe(false);
  });

  test('email valide avec sous-domaine', () => {
    expect(isValidEmail('user@mail.co.uk')).toBe(true);
  });
});

// =====================
// TESTS VALIDATION MOT DE PASSE
// =====================
describe('Validation mot de passe', () => {
  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('Minimum 8 caractères.');
    if (!pwd.match(/[a-z]/)) errors.push('1 minuscule requise.');
    if (!pwd.match(/[A-Z]/)) errors.push('1 majuscule requise.');
    if (!pwd.match(/[0-9]/)) errors.push('1 chiffre requis.');
    if (!pwd.match(/[^a-zA-Z0-9]/)) errors.push('1 caractère spécial requis.');
    return errors;
  };

  test('mot de passe valide', () => {
    expect(validatePassword('Password1!')).toHaveLength(0);
  });

  test('mot de passe trop court', () => {
    expect(validatePassword('Ab1!')).toContain('Minimum 8 caractères.');
  });

  test('mot de passe sans majuscule', () => {
    expect(validatePassword('password1!')).toContain('1 majuscule requise.');
  });

  test('mot de passe sans minuscule', () => {
    expect(validatePassword('PASSWORD1!')).toContain('1 minuscule requise.');
  });

  test('mot de passe sans chiffre', () => {
    expect(validatePassword('Password!')).toContain('1 chiffre requis.');
  });

  test('mot de passe sans caractère spécial', () => {
    expect(validatePassword('Password1')).toContain('1 caractère spécial requis.');
  });

  test('mot de passe vide a toutes les erreurs', () => {
    expect(validatePassword('')).toHaveLength(5);
  });
});

// =====================
// TESTS VALIDATION PSEUDO
// =====================
describe('Validation pseudo', () => {
  const validateNickname = (text) => {
    if (text.trim().length === 0) return 'Le pseudo est obligatoire.';
    if (text.trim().length < 3) return 'Minimum 3 caractères.';
    if (text.trim().length > 20) return 'Maximum 20 caractères.';
    return '';
  };

  test('pseudo valide', () => {
    expect(validateNickname('StreetArtist')).toBe('');
  });

  test('pseudo vide', () => {
    expect(validateNickname('')).toBe('Le pseudo est obligatoire.');
  });

  test('pseudo trop court', () => {
    expect(validateNickname('ab')).toBe('Minimum 3 caractères.');
  });

  test('pseudo trop long', () => {
    expect(validateNickname('a'.repeat(21))).toBe('Maximum 20 caractères.');
  });

  test('pseudo avec espaces seulement', () => {
    expect(validateNickname('   ')).toBe('Le pseudo est obligatoire.');
  });

  test('pseudo exactement 3 caractères', () => {
    expect(validateNickname('abc')).toBe('');
  });

  test('pseudo exactement 20 caractères', () => {
    expect(validateNickname('a'.repeat(20))).toBe('');
  });
});

// =====================
// TESTS CONFIRMATION MOT DE PASSE
// =====================
describe('Confirmation mot de passe', () => {
  const validateConfirm = (confirm, password) => {
    return confirm !== password ? 'Les mots de passe ne correspondent pas.' : '';
  };

  test('mots de passe identiques', () => {
    expect(validateConfirm('Password1!', 'Password1!')).toBe('');
  });

  test('mots de passe différents', () => {
    expect(validateConfirm('Password1!', 'Password2!')).toBe('Les mots de passe ne correspondent pas.');
  });

  test('confirmation vide', () => {
    expect(validateConfirm('', 'Password1!')).toBe('Les mots de passe ne correspondent pas.');
  });
});

// =====================
// TESTS FORMATAGE ARTWORKS
// =====================
describe('Formatage des artworks', () => {
  const formatArtwork = (item, index) => ({
    id: item.createdAt?.toString() ?? index.toString(),
    url: item.url ?? item.photo ?? '',
    uid: item.uid,
    createdAt: item.createdAt,
    lat: item.lat ?? null,
    lng: item.lng ?? null,
    likes: 0,
    liked: false,
    description: item.description ?? '',
  });

  test('artwork avec url', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).url).toBe('https://test.com/photo.jpg');
  });

  test('artwork avec photo (ancienne clé)', () => {
    const item = { photo: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).url).toBe('https://test.com/photo.jpg');
  });

  test('artwork sans image retourne chaine vide', () => {
    const item = { uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).url).toBe('');
  });

  test('artwork likes initialisé à 0', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).likes).toBe(0);
  });

  test('artwork liked initialisé à false', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).liked).toBe(false);
  });

  test('artwork id utilise createdAt', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).id).toBe('123456');
  });

  test('artwork id utilise index si createdAt absent', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1' };
    expect(formatArtwork(item, 5).id).toBe('5');
  });

  test('artwork description vide par défaut', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456 };
    expect(formatArtwork(item, 0).description).toBe('');
  });

  test('artwork description conservée', () => {
    const item = { url: 'https://test.com/photo.jpg', uid: 'user1', createdAt: 123456, description: 'Belle fresque' };
    expect(formatArtwork(item, 0).description).toBe('Belle fresque');
  });
});

// =====================
// TESTS LOGIQUE LIKE
// =====================
describe('Logique like', () => {
  const toggleLike = (artwork) => ({
    ...artwork,
    liked: !artwork.liked,
    likes: artwork.liked ? artwork.likes - 1 : artwork.likes + 1,
  });

  test('liker un artwork', () => {
    const artwork = { liked: false, likes: 5 };
    expect(toggleLike(artwork)).toEqual({ liked: true, likes: 6 });
  });

  test('unliker un artwork', () => {
    const artwork = { liked: true, likes: 6 };
    expect(toggleLike(artwork)).toEqual({ liked: false, likes: 5 });
  });

  test('likes à 0 après unlike', () => {
    const artwork = { liked: true, likes: 1 };
    expect(toggleLike(artwork).likes).toBe(0);
  });
});

// =====================
// TESTS COORDONNÉES GPS
// =====================
describe('Coordonnées GPS', () => {
  const hasLocation = (lat, lng) => !!lat && !!lng;

  test('coordonnées valides', () => {
    expect(hasLocation(48.8566, 2.3522)).toBe(true);
  });

  test('coordonnées manquantes', () => {
    expect(hasLocation(undefined, undefined)).toBe(false);
  });

  test('latitude manquante', () => {
    expect(hasLocation(undefined, 2.3522)).toBe(false);
  });

  test('longitude manquante', () => {
    expect(hasLocation(48.8566, undefined)).toBe(false);
  });

  test('coordonnées à zéro retourne false', () => {
    expect(hasLocation(0, 0)).toBe(false);
  });
});