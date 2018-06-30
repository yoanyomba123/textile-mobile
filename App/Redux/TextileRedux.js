import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  onboardedSuccess: null,

  toggleVerboseUi: null,

  locationUpdate: null,
  backgroundTask: null,

  urisToIgnore: ['uris'],
  imageAdded: ['uri', 'thread', 'hash', 'remotePayloadPath'],
  imageUploadRetried: ['hash'],

  imageUploadProgress: ['data'],
  imageUploadComplete: ['data'],
  imageUploadError: ['data'],
  imageRemovalComplete: ['id'],

  photosTaskError: ['error'],
  photosProcessing: ['photos'],
  photoProcessingError: ['uri', 'error'],

  pairNewDevice: ['pubKey'],
  pairNewDeviceSuccess: ['pubKey'],
  pairNewDeviceError: ['pubKey'],

  newThreadRequest: ['name'],
  newThreadSuccess: ['name'],
  newThreadError: ['error'],

  leaveThreadRequest: ['name'],
  leaveThreadSuccess: ['name'],
  leaveThreadError: ['error'],

  refreshThreadsRequest: null,
  refreshThreadsSuccess: ['threads'],
  refreshThreadsError: ['error']
})

export const TextileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  onboarded: false,
  preferences: {
    verboseUi: false
  },
  images: {
    error: false,
    loading: false,
    items: []
  },
  camera: {},
  devices: [],
  threads: [
    {
      id: 'default',
      name: 'default',
      members: null,
      inviteLink: null
    }
  ]
})

/* ------------- Selectors ------------- */
export const TextileSelectors = {
  // TODO: Add more selectors here as we learn how they are used
  itemsById: (state, id) => {
    return state.textile.images.items.filter(item => item.hash === id)
  },
  onboarded: state => state.textile.onboarded,
  camera: state => state.textile.camera,
  threads: state => state.textile.threads
}

/* ------------- Reducers ------------- */

export const onboardedSuccess = state => {
  return state.merge({ onboarded: true })
}

// Used to ignore certain URIs in the CameraRoll
export const handleUrisToIgnore = (state, {uris}) => {
  let newUri = {}
  for (let uri of uris) {
    newUri[uri] = 'complete'
  }
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const toggleVerboseUi = state =>
  state.merge({ preferences: { ...state.preferences, verboseUi: !state.preferences.verboseUi } })

export const handlePhotosProcessing = (state, {photos}) => {
  let newUri = {}
  for (let photo of photos) {
    newUri[photo.uri] = 'processing'
  }
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const handlePhotoProcessingError = (state, {uri, error}) => {
  let newUri = {}
  newUri[uri] = 'error'
  let processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  return state.merge({ camera: { processed } })
}

export const handleImageAdded = (state, {uri, thread, hash, remotePayloadPath}) => {
  let newUri = {}
  newUri[uri] = 'complete'
  const processed = state.camera && state.camera.processed ? state.camera.processed.merge(newUri) : newUri
  const items = [{ thread, hash, remotePayloadPath, state: 'pending', remainingUploadAttempts: 3 }, ...state.images.items]
  return state.merge({ images: { items }, camera: { processed } })
}

export const handleImageUploadRetried = (state, {hash}) => {
  const items = state.images.items.map(item => {
    if (item.hash === hash) {
      return {...item, state: 'pending'}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageProgress = (state, {data}) => {
  const { id, progress } = data
  // The upload library we're using returns float 0.0 - 100.0
  const fractionalProgress = progress / 100.0
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'processing', progress: fractionalProgress}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadComplete = (state, {data}) => {
  const { id } = data
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {...item, state: 'complete', id}
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const handleImageUploadError = (state, {data}) => {
  const { error, id } = data
  const items = state.images.items.map(item => {
    if (item.hash === id) {
      return {
        ...item,
        remainingUploadAttempts: item.remainingUploadAttempts - 1,
        state: 'error',
        error: error,
        id
      }
    }
    return item
  })
  return state.merge({ images: { items } })
}

export const imageRemovalComplete = (state, {id}) => {
  const items = state.images.items.filter(item => item.hash !== id)
  return state.merge({ images: { items } })
}

export const pairNewDevice = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = [{ pubKey, state: 'pending' }, ...existingDevices]
  return state.merge({ devices })
}

export const pairNewDeviceSuccess = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = existingDevices.map(device => {
    if (device.pubKey === pubKey) {
      return { pubKey: device.pubKey, state: 'paired' }
    }
    return device
  })
  return state.merge({ devices })
}

export const pairNewDeviceError = (state, {pubKey}) => {
  const existingDevices = state.devices ? state.devices : []
  const devices = existingDevices.map(device => {
    if (device.pubKey === pubKey) {
      return { pubKey: device.pubKey, state: 'error' }
    }
    return device
  })
  return state.merge({ devices })
}

// FIXME: Not needed after we use TextileNode API
export const handleNewThreadsSucccess = (state, {name}) => {
  const newThread = {
    id: name,
    name,
    members: [],
    inviteLink: 'https://textile.photos'
  }
  const threads = [...state.threads, newThread]
  return state.merge({threads})
}

// FIXME: Not needed after we use TextileNode API
export const handleLeaveThreadsSucccess = (state, {name}) => {
  const threads = state.threads.filter(thread => thread.name !== name)
  return state.merge({threads})
}

export const handleRefreshThreadsSucccess = (state, {threads}) => {
  return state.merge({threads})
}

// Helper so sagas can figure out current items loaded
// const getItems = state => state.items

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.ONBOARDED_SUCCESS]: onboardedSuccess,

  [Types.TOGGLE_VERBOSE_UI]: toggleVerboseUi,
  [Types.PHOTOS_PROCESSING]: handlePhotosProcessing,
  [Types.PHOTO_PROCESSING_ERROR]: handlePhotoProcessingError,

  [Types.IMAGE_ADDED]: handleImageAdded,
  [Types.URIS_TO_IGNORE]: handleUrisToIgnore,
  [Types.IMAGE_UPLOAD_RETRIED]: handleImageUploadRetried,

  [Types.IMAGE_UPLOAD_PROGRESS]: handleImageProgress,
  [Types.IMAGE_UPLOAD_COMPLETE]: handleImageUploadComplete,
  [Types.IMAGE_UPLOAD_ERROR]: handleImageUploadError,
  [Types.IMAGE_REMOVAL_COMPLETE]: imageRemovalComplete,

  [Types.PAIR_NEW_DEVICE]: pairNewDevice,
  [Types.PAIR_NEW_DEVICE_SUCCESS]: pairNewDeviceSuccess,
  [Types.PAIR_NEW_DEVICE_ERROR]: pairNewDeviceError,

  [Types.NEW_THREAD_SUCCESS]: handleNewThreadsSucccess,
  [Types.LEAVE_THREAD_SUCCESS]: handleLeaveThreadsSucccess,
  [Types.REFRESH_THREADS_SUCCESS]: handleRefreshThreadsSucccess
})
