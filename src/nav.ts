import { router, type Href } from 'expo-router';

export function openProduct(id: string) {
  router.push(`/product/${id}` as Href);
}

export function openCreator(id: string) {
  router.push(`/creator/${id}` as Href);
}

export function openFile(id: string) {
  router.push(`/reader/${id}` as Href);
}

export function openNotifs() {
  router.push('/notifs' as Href);
}

export function openStudio() {
  router.push('/studio' as Href);
}

export function openLibrary() {
  router.push('/library' as Href);
}

export function openHome() {
  router.replace('/' as Href);
}

export function goBack() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/');
}
