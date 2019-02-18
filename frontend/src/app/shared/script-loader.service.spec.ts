import { TestBed } from '@angular/core/testing';

import { DynamicScriptLoaderService } from './script-loader.service';

describe('ScriptLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicScriptLoaderService = TestBed.get(DynamicScriptLoaderService);
    expect(service).toBeTruthy();
  });
});
