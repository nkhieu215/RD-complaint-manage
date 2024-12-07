import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IListOfError } from '../list-of-error.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../list-of-error.test-samples';

import { ListOfErrorService, RestListOfError } from './list-of-error.service';

const requireRestSample: RestListOfError = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
  updated_at: sampleWithRequiredData.updated_at?.toJSON(),
  check_time: sampleWithRequiredData.check_time?.toJSON(),
};

describe('ListOfError Service', () => {
  let service: ListOfErrorService;
  let httpMock: HttpTestingController;
  let expectedResult: IListOfError | IListOfError[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ListOfErrorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ListOfError', () => {
      const listOfError = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(listOfError).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ListOfError', () => {
      const listOfError = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(listOfError).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ListOfError', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ListOfError', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ListOfError', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addListOfErrorToCollectionIfMissing', () => {
      it('should add a ListOfError to an empty array', () => {
        const listOfError: IListOfError = sampleWithRequiredData;
        expectedResult = service.addListOfErrorToCollectionIfMissing([], listOfError);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(listOfError);
      });

      it('should not add a ListOfError to an array that contains it', () => {
        const listOfError: IListOfError = sampleWithRequiredData;
        const listOfErrorCollection: IListOfError[] = [
          {
            ...listOfError,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addListOfErrorToCollectionIfMissing(listOfErrorCollection, listOfError);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ListOfError to an array that doesn't contain it", () => {
        const listOfError: IListOfError = sampleWithRequiredData;
        const listOfErrorCollection: IListOfError[] = [sampleWithPartialData];
        expectedResult = service.addListOfErrorToCollectionIfMissing(listOfErrorCollection, listOfError);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(listOfError);
      });

      it('should add only unique ListOfError to an array', () => {
        const listOfErrorArray: IListOfError[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const listOfErrorCollection: IListOfError[] = [sampleWithRequiredData];
        expectedResult = service.addListOfErrorToCollectionIfMissing(listOfErrorCollection, ...listOfErrorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const listOfError: IListOfError = sampleWithRequiredData;
        const listOfError2: IListOfError = sampleWithPartialData;
        expectedResult = service.addListOfErrorToCollectionIfMissing([], listOfError, listOfError2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(listOfError);
        expect(expectedResult).toContain(listOfError2);
      });

      it('should accept null and undefined values', () => {
        const listOfError: IListOfError = sampleWithRequiredData;
        expectedResult = service.addListOfErrorToCollectionIfMissing([], null, listOfError, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(listOfError);
      });

      it('should return initial array if no ListOfError is added', () => {
        const listOfErrorCollection: IListOfError[] = [sampleWithRequiredData];
        expectedResult = service.addListOfErrorToCollectionIfMissing(listOfErrorCollection, undefined, null);
        expect(expectedResult).toEqual(listOfErrorCollection);
      });
    });

    describe('compareListOfError', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareListOfError(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareListOfError(entity1, entity2);
        const compareResult2 = service.compareListOfError(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareListOfError(entity1, entity2);
        const compareResult2 = service.compareListOfError(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareListOfError(entity1, entity2);
        const compareResult2 = service.compareListOfError(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
