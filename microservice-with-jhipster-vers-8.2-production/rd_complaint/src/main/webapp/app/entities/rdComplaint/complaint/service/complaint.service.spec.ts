import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IComplaint } from '../complaint.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../complaint.test-samples';

import { ComplaintService, RestComplaint } from './complaint.service';

const requireRestSample: RestComplaint = {
  ...sampleWithRequiredData,
  created_at: sampleWithRequiredData.created_at?.toJSON(),
};

describe('Complaint Service', () => {
  let service: ComplaintService;
  let httpMock: HttpTestingController;
  let expectedResult: IComplaint | IComplaint[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ComplaintService);
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

    it('should create a Complaint', () => {
      const complaint = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(complaint).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Complaint', () => {
      const complaint = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(complaint).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Complaint', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Complaint', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Complaint', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addComplaintToCollectionIfMissing', () => {
      it('should add a Complaint to an empty array', () => {
        const complaint: IComplaint = sampleWithRequiredData;
        expectedResult = service.addComplaintToCollectionIfMissing([], complaint);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(complaint);
      });

      it('should not add a Complaint to an array that contains it', () => {
        const complaint: IComplaint = sampleWithRequiredData;
        const complaintCollection: IComplaint[] = [
          {
            ...complaint,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addComplaintToCollectionIfMissing(complaintCollection, complaint);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Complaint to an array that doesn't contain it", () => {
        const complaint: IComplaint = sampleWithRequiredData;
        const complaintCollection: IComplaint[] = [sampleWithPartialData];
        expectedResult = service.addComplaintToCollectionIfMissing(complaintCollection, complaint);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(complaint);
      });

      it('should add only unique Complaint to an array', () => {
        const complaintArray: IComplaint[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const complaintCollection: IComplaint[] = [sampleWithRequiredData];
        expectedResult = service.addComplaintToCollectionIfMissing(complaintCollection, ...complaintArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const complaint: IComplaint = sampleWithRequiredData;
        const complaint2: IComplaint = sampleWithPartialData;
        expectedResult = service.addComplaintToCollectionIfMissing([], complaint, complaint2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(complaint);
        expect(expectedResult).toContain(complaint2);
      });

      it('should accept null and undefined values', () => {
        const complaint: IComplaint = sampleWithRequiredData;
        expectedResult = service.addComplaintToCollectionIfMissing([], null, complaint, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(complaint);
      });

      it('should return initial array if no Complaint is added', () => {
        const complaintCollection: IComplaint[] = [sampleWithRequiredData];
        expectedResult = service.addComplaintToCollectionIfMissing(complaintCollection, undefined, null);
        expect(expectedResult).toEqual(complaintCollection);
      });
    });

    describe('compareComplaint', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareComplaint(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareComplaint(entity1, entity2);
        const compareResult2 = service.compareComplaint(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareComplaint(entity1, entity2);
        const compareResult2 = service.compareComplaint(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareComplaint(entity1, entity2);
        const compareResult2 = service.compareComplaint(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
